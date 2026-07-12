require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food", emoji: "🍔") }
    let!(:transport) { Category.create!(name: "Transport", emoji: "🚗") }
    let!(:supplies) { Category.create!(name: "Supplies", emoji: "📦") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end
  end

  describe "POST /api/categories" do
    context "with valid parameters" do
      let(:valid_params) do
        {
          category: {
            name: "Sports",
            emoji: "🏌️"
          }
        }
      end

      it "creates a new category" do
        expect {
          post "/api/categories", params: valid_params, as: :json
        }.to change(Category, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["name"]).to eq("Sports")
        expect(json["emoji"]).to eq("🏌️")
      end
    end

    context "with invalid parameters" do
      it "with empty name" do
        invalid_params = {
          category: {
            name: "",
            emoji: "🍔"
          }
        }

        expect {
          post "/api/categories", params: invalid_params, as: :json
        }.to_not change(Category, :count)

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "with empty emoji" do
        invalid_params = {
          category: {
            name: "Food",
            emoji: ""
          }
        }

        expect {
          post "/api/categories", params: invalid_params, as: :json
        }.to_not change(Category, :count)

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
