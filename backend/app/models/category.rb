class Category < ApplicationRecord
  has_many :expenses, dependent: :destroy
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :emoji, presence: true
end
